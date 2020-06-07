const test = require('ava')

const geom3 = require('../geometry/geom3')

const { geodesicSphere } = require('./index')

const comparePolygonsAsPoints = require('../../test/helpers/comparePolygonsAsPoints')

test('geodesicSphere (defaults)', (t) => {
  const obs = geodesicSphere()
  const pts = geom3.toPoints(obs)
  t.is(pts.length, 20)
})

test('geodesicSphere (options)', (t) => {
  // test radius
  let obs = geodesicSphere({ radius: 5 })
  let pts = geom3.toPoints(obs)
  const exp = [
    [[4.253254413604736, 0, 2.628654956817627],
      [2.628654956817627, -4.253254413604736, 0],
      [4.253254413604736, 0, -2.628654956817627]],
    [[4.253254413604736, 0, -2.628654956817627],
      [2.628654956817627, 4.253254413604736, 0],
      [4.253254413604736, 0, 2.628654956817627]],
    [[4.253254413604736, 0, -2.628654956817627],
      [0, -2.628654956817627, -4.253254413604736],
      [0, 2.628654956817627, -4.253254413604736]],
    [[4.253254413604736, 0, -2.628654956817627],
      [0, 2.628654956817627, -4.253254413604736],
      [2.628654956817627, 4.253254413604736, 0]],
    [[4.253254413604736, 0, -2.628654956817627],
      [2.628654956817627, -4.253254413604736, 0],
      [0, -2.628654956817627, -4.253254413604736]],
    [[0, -2.628654956817627, 4.253254413604736],
      [4.253254413604736, 0, 2.628654956817627],
      [0, 2.628654956817627, 4.253254413604736]],
    [[2.628654956817627, -4.253254413604736, 0],
      [4.253254413604736, 0, 2.628654956817627],
      [0, -2.628654956817627, 4.253254413604736]],
    [[4.253254413604736, 0, 2.628654956817627],
      [2.628654956817627, 4.253254413604736, 0],
      [0, 2.628654956817627, 4.253254413604736]],
    [[-4.253254413604736, 0, -2.628654956817627],
      [-2.628654956817627, -4.253254413604736, 0],
      [-4.253254413604736, 0, 2.628654956817627]],
    [[-4.253254413604736, 0, 2.628654956817627],
      [-2.628654956817627, 4.253254413604736, 0],
      [-4.253254413604736, 0, -2.628654956817627]],
    [[0, -2.628654956817627, 4.253254413604736],
      [0, 2.628654956817627, 4.253254413604736],
      [-4.253254413604736, 0, 2.628654956817627]],
    [[-4.253254413604736, 0, 2.628654956817627],
      [-2.628654956817627, -4.253254413604736, 0],
      [0, -2.628654956817627, 4.253254413604736]],
    [[0, 2.628654956817627, 4.253254413604736],
      [-2.628654956817627, 4.253254413604736, 0],
      [-4.253254413604736, 0, 2.628654956817627]],
    [[0, 2.628654956817627, -4.253254413604736],
      [0, -2.628654956817627, -4.253254413604736],
      [-4.253254413604736, 0, -2.628654956817627]],
    [[-4.253254413604736, 0, -2.628654956817627],
      [-2.628654956817627, 4.253254413604736, 0],
      [0, 2.628654956817627, -4.253254413604736]],
    [[-4.253254413604736, 0, -2.628654956817627],
      [0, -2.628654956817627, -4.253254413604736],
      [-2.628654956817627, -4.253254413604736, 0]],
    [[0, -2.628654956817627, 4.253254413604736],
      [-2.628654956817627, -4.253254413604736, 0],
      [2.628654956817627, -4.253254413604736, 0]],
    [[0, 2.628654956817627, 4.253254413604736],
      [2.628654956817627, 4.253254413604736, 0],
      [-2.628654956817627, 4.253254413604736, 0]],
    [[0, 2.628654956817627, -4.253254413604736],
      [-2.628654956817627, 4.253254413604736, 0],
      [2.628654956817627, 4.253254413604736, 0]],
    [[0, -2.628654956817627, -4.253254413604736],
      [2.628654956817627, -4.253254413604736, 0],
      [-2.628654956817627, -4.253254413604736, 0]]
  ]

  t.is(pts.length, 20)
  t.true(comparePolygonsAsPoints(pts, exp))

  // test frequency
  obs = geodesicSphere({ radius: 5, frequency: 18 })
  pts = geom3.toPoints(obs)

  t.is(pts.length, 180)
})
