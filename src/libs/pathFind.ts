type Vector = {
  x: number
  y: number
}
type Node = {
  x: number
  y: number
  parent: Node | null
  level: number
}
/**
 *  ALGORITMO DE PROPAGACION, elgorimo propaga con los ultimos nodos en vanguardia, valida con visitantes
 * @param {*} from
 * @param {*} to
 * @param {*} validate
 * @returns
 */
export default function PathFind(
  from: Vector,
  to: Vector,
  validate: (x: number, y: number) => boolean
) {
  const visited: { [key: string]: boolean } = {}
  var deep = 0
  var vanguard: Node[] = [
    {
      x: from.x,
      y: from.y,
      parent: null,
      level: 0
    }
  ]

  function validateNode(x: number, y: number) {
    if (visited.hasOwnProperty(x + '_' + y)) {
      return false
    }

    visited[x + '_' + y] = true

    if (from.x === x && from.y === y) {
      return true
    }

    return validate(x, y)
  }

  const founds = []

  const propagate = (vx: number, vy: number, node: Node): Node => {
    return {
      x: node.x + vx,
      y: node.y + vy,
      parent: node,
      level: node.level + 1
    }
  }
  while (deep < 200 && vanguard.length > 0) {
    deep++
    let newvanguard = []
    for (let i in vanguard) {
      const node = vanguard[i]
      if (node.x === to.x && node.y === to.y) {
        founds.push(node)
        break
      }
      if (validateNode(node.x, node.y)) {
        newvanguard.push(propagate(1, 0, node))
        newvanguard.push(propagate(-1, 0, node))
        newvanguard.push(propagate(0, -1, node))
        newvanguard.push(propagate(0, 1, node))
      }
    }

    vanguard = newvanguard
  }

  var best: Node = founds.sort((nodeA, nodeB) => nodeA.level - nodeB.level)[0]
  const result: Vector[] = []
  let current: Node | null = best
  while (current) {
    const { x, y } = current
    result.unshift({ x, y })
    current = current.parent
  }

  return result
}
