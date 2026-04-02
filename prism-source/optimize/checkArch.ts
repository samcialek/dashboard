import { ARCHETYPES } from "../config/archetypes.js";
for (const id of ["117", "074", "065", "112", "086", "096"]) {
  const a = ARCHETYPES.find(x => x.id === id);
  if (!a) continue;
  console.log(id, a.name);
  for (const nid of ["PF","ENG","TRB","COM","PRO","MOR","CD","CU","ZS","MAT","ONT_H","ONT_S"]) {
    const n = (a.nodes as any)[nid];
    if (n) console.log("  " + nid + ":", JSON.stringify(n));
  }
  console.log();
}
