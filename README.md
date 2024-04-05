# 1ofx p5.js Template Instructions

This is a template for p5.js for creating projects on 1ofx.

## Create your art
-   The entrypoint is the `draw()` function which will be triggered automatically everytime the user updates the hash. Everything necessary for the sketch to render properly should be initialized in `draw()`. Find an example in `index.js`. The `setup()` function will only be called once in the beginning, but not for every change of hash.
-   Your artwork has to be able to properly render in a square browser window of sizes up to 6000x6000px.
-   If you use any libraries, include all source files in the project. Do not load any dependencies from the internet.
-   For development, a random hash is generated on every page load, to deactivate this for deployment, please set `randomHashForTesting = false` in `index.html`. 
-   To handle window resizing, please put your code in `windowResizedUser()` in `index.js`.

## Randomness

For all randomness, please use the provided function `random1ofx()`.

## License

[MIT License](./LICENSE)
