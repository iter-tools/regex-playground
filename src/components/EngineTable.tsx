import { Engine } from "@iter-tools/regex/internal/engine";

/**
 * This is the Engine info panel that appears on the side of the screen when you
 * open the playground. It has the following properties displayed in a table:
 *
 * - Width
 * - Index
 * - Starved
 * - Done
 * - LastChr
 * - Chr
 */
function EngineTable({ engine }: { engine: Engine }) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Width</th>
          <td>{engine.context0.width}</td>
        </tr>
        <tr>
          <th>Index</th>
          <td>{engine.index}</td>
        </tr>
        <tr>
          <th>Starved</th>
          <td>{engine.starved.toString()}</td>
        </tr>
        <tr>
          <th>Done</th>
          <td>{engine.done.toString()}</td>
        </tr>
        <tr>
          <th>LastChr</th>
          <td>{engine.context0.lastChr}</td>
        </tr>
        <tr>
          <th>Chr</th>
          <td>{engine.context1.chr}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default EngineTable;
