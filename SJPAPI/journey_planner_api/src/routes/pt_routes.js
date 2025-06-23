const express = require('express');
const PriorityQueue = require('priorityqueuejs');
const router = express.Router(); //For routes to be used in server
const fs = require('fs');
const Graph = require('graphology'); //complex graphs handle libRary
const {parseString} = require('xml2js'); //XML to JS

const graph = new Graph();

// Load graph from .graphml file
const graphmlData = fs.readFileSync('./static/isb_pt_net.graphml', 'utf-8');

// Parse GraphML data
parseString(graphmlData, (err, result) => {
  //Error Shown IF Available
  if (err) {
    throw new Error('Error parsing GraphML file');
  }
  //Extracting GRAPHML data
  const nodes = result.graphml.graph[0].node; //Array of nodes
  const edges = result.graphml.graph[0].edge; //Array of Edges

  //Nodes Adding nodeS to Graphology Graph
  nodes.forEach(node => {
    const nodeId = node.$.id;
    //$ and _ for attribtue and _ for text (string to float)
    const latitude = parseFloat(node.data.find(d => d.$.key === 'd0')._);
    const longitude = parseFloat(node.data.find(d => d.$.key === 'd1')._);
    const route_id = node.data.find(d => d.$.key === 'd2')._;
    graph.addNode(nodeId, {latitude, longitude, route_id});
  });

  // Add edges to the graphology graph
  edges.forEach(edge => {
    const source = edge.$.source;
    const target = edge.$.target;
    const weight = parseInt(edge.data[0]._);
    //Reg Exp Insensitve
    const isRoute = /^True$/i.test(edge.data.find(d => d.$.key === 'd4')._);
    const isRouteShift = /^True$/i.test(
      edge.data.find(d => d.$.key === 'd5')._,
    );
    graph.addEdge(source, target, {weight, isRoute, isRouteShift});
  });
});

// Dijkstra's algorithm with route shifts
function dijkstraWithRouteShifts(startNode, endNode, maxRouteShifts) {
  const distances = {}; // To store the shortest distances to each node
  const visited = new Set(); // To keep track of visited nodes
  const queue = new PriorityQueue((a, b) => distances[a] - distances[b]);
  // Initialize distances
  for (const node in graph.nodes()) {
    distances[graph.nodes()[node]] = Infinity;
  }
  distances[startNode] = 0;

  visited.add(startNode);
  queue.enq(startNode);

  let routeShifts = 0; // Track the number of route shifts

  while (!queue.isEmpty()) {
    const currentNode = queue.deq();

    // Check if we've reached the endNode
    if (currentNode === endNode) {
      break; // Optional: Exit early if the end node is reached
    }
    for (const neighbor_ind in Object.values(graph.outNeighbors(currentNode))) {
      neighbor = graph.outNeighbors(currentNode)[neighbor_ind];
      const edge_data = graph.getEdgeAttributes(currentNode, neighbor);
      const weight = edge_data.weight;
      const potentialDistance = distances[currentNode] + weight;
      const routeShift = edge_data.isRouteShift;
      if (
        potentialDistance < distances[neighbor] &&
        (routeShift || !visited.has(neighbor))
      ) {
        distances[neighbor] = potentialDistance;
        visited.add(neighbor);
        queue.enq(neighbor);

        // Check for negative weight cycles
        if (routeShift && routeShifts >= maxRouteShifts) {
          throw new Error('Exceeded maximum route shifts');
        }

        if (routeShift) {
          routeShifts++;
        }
      }
    }
  }

  // Check if there is no valid path from startNode to endNode
  if (distances[endNode] === Infinity) {
    return {
      distance: Infinity,
      path: [],
      routeShifts: routeShifts,
    };
  }
  // Build and return the shortest path from startNode to endNode
  let index = 0;
  const shortestPath = [
    {
      index,
      pt_stop: endNode,
      coordinates: {
        latitude: graph.getNodeAttributes(endNode).latitude,
        longitude: graph.getNodeAttributes(endNode).longitude,
        route_id: graph.getNodeAttributes(endNode).route_id,
      },
      unboarding: true,
      boarding: false,
    },
  ];
  index++;
  let currentNode = endNode;
  while (currentNode !== startNode) {
    for (const neighbor_ind in Object.values(graph.inNeighbors(currentNode))) {
      neighbor = graph.inNeighbors(currentNode)[neighbor_ind];
      const edge_data = graph.getEdgeAttributes(neighbor, currentNode);
      if (distances[currentNode] === distances[neighbor] + edge_data.weight) {
        neighbor_data = graph.getNodeAttributes(neighbor);
        shortestPath.unshift({
          index,
          pt_stop: neighbor,
          coordinates: {
            latitude: neighbor_data.latitude,
            longitude: neighbor_data.longitude,
            route_id: neighbor_data.route_id,
          },
          unboarding: edge_data.isRouteShift,
          boarding: false,
        });
        index++;
        if (edge_data.isRouteShift) {
          shortestPath[1].boarding = true;
        }
        currentNode = neighbor;
        break;
      }
    }
  }
  // Add indexting to the stops objects to maintain sequence
  const max_index = index;
  for (let node in shortestPath) {
    shortestPath[node].index = max_index - index;
    index--;
  }
  shortestPath[0].boarding = true; // Set boarding true for the first stop in trip

  return {
    distance: distances[endNode],
    path: shortestPath,
    routeShifts: routeShifts,
  };
}

/**
 * Calculate the Haversine distance between two sets of coordinates on Earth.
 * @param {Object} coord1 - First coordinates {latitude, longitude} in degrees.
 * @param {Object} coord2 - Second coordinates {latitude, longitude} in degrees.
 * @returns {number} - The Haversine distance in kilometers.
 */
function calculateDistance(coord1, coord2) {
  // Radius of the Earth in kilometers (mean value)
  const earthRadiusKm = 6371.0;

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = degToRad(coord1.latitude);
  const lon1Rad = degToRad(coord1.longitude);
  const lat2Rad = degToRad(coord2.latitude);
  const lon2Rad = degToRad(coord2.longitude);

  // Differences in coordinates
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = earthRadiusKm * c;

  return distance;
}

/**
 * Convert degrees to radians.
 * @param {number} degrees - Angle in degrees.
 * @returns {number} - Angle in radians.
 */
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Function to find the nearest stop node based on coordinates
function findNearestStopNode(coordinates) {
  let nearestNode;
  let minDistance = Infinity;
  graph.forEachNode((node, attr) => {
    const nodeCoordinates = {
      latitude: attr.latitude,
      longitude: attr.longitude,
    };
    const distance = calculateDistance(coordinates, nodeCoordinates);

    if (distance < minDistance) {
      minDistance = distance;
      nearestNode = node;
    }
  });

  return nearestNode;
}

// API endpoint for route planning
router.post('/route', (req, res) => {
  /**
   * @api {post} routes/route route
   * @apiName PostRoute
   * @apiGroup routes
   * @apiBody {String} [sourceLatitude = "33.619279734409304"] Latitude value of trip origin (most likely user's current location)
   * @apiBody {String} [sourceLongitude = "73.12585712853978"] Longitude value of trip origin (most likely user's current location)
   * @apiBody {String} [destinationLatitude = "33.68588140912486"] Latitude value of trip destination
   * @apiBody {String} [destinationLongitude = "73.1174845560088"] Longitude value of trip origin
   * @apiError InternalServerError An error occurred during login
   * @apiErrorExample 500
   *     HTTP/1.1 500 InternalServerError
   *     {
   *       "error": "Something went wrong, please contact server administrator"
   *     }
   */
  const sourceCoordinates = {
    latitude: req.body.sourceLatitude,
    longitude: req.body.sourceLongitude,
  };
  const destinationCoordinates = {
    latitude: req.body.destinationLatitude,
    longitude: req.body.destinationLongitude,
  };

  // Find the nearest stop nodes for the source and destination
  const nearestSourceNode = findNearestStopNode(sourceCoordinates);
  const nearestDestinationNode = findNearestStopNode(destinationCoordinates);

  //const path = dijkstraWithRouteShifts(nearestSourceNode, nearestDestinationNode, 3);
  const path = dijkstraWithRouteShifts(
    nearestSourceNode,
    nearestDestinationNode,
  );
  res.json({
    trip_origin: sourceCoordinates,
    pt_route: path,
    trip_destination: destinationCoordinates,
  });
});

module.exports = router;
