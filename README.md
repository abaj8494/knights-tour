# Knight's Tour Solver

A web-based implementation of the Knight's Tour solver, deployed on GitHub Pages.

## About

The Knight's Tour is a sequence of moves by a knight on a chessboard such that the knight visits every square exactly once. This project provides an interactive solver that uses Warnsdorff's heuristic to find solutions efficiently.

This is a JavaScript port of a Python implementation, designed to work as a static website on GitHub Pages.

## Features

- Solves NxM boards (from 3x3 up to 12x12)
- Supports both closed and non-closed tours
- Single player mode for trying to solve the puzzle manually
- Labeled grid with coordinates
- Arbitrary starting positions
- Animated solution display

## How to Use

1. Visit the live demo at [https://abaj8494.github.io/knights-tour](https://abaj8494.github.io/knights-tour)
2. Set the board size (default is 8x8)
3. Choose a mode:
   - **Solver Mode**: Click "Select Start" then click on a starting square
   - **Player Mode**: Click "Play Mode" then click on a starting square, then make valid knight moves
4. For Solver Mode, you can check/uncheck the "Closed Tour" option

## How It Works

The Knight's Tour solver uses backtracking with Warnsdorff's heuristic, which prioritizes moves to squares with the fewest onward moves available. This significantly improves performance compared to a naive approach.

## Development

This project uses pure HTML, CSS, and JavaScript with no external dependencies.

### Local Setup

1. Clone this repository
2. Open `index.html` in a web browser

### Deployment

The site is automatically deployed to GitHub Pages from the main branch.

## Credits

Original Python implementation by Aayush Bajaj.
JavaScript port and web version created for GitHub Pages deployment.