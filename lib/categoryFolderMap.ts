import fs from "fs";
import path from "path";

const getFilesByFolder = (folder: string) => {
  try {
  const fileDirPath: string = path.join(
    process.cwd(),
    "public",
    "productImages",
    folder
  );

  const files = fs
  .readdirSync(fileDirPath, { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((file) => file.name)
  .map((file) => `${folder}/${file}`)
  .filter((file) => file.endsWith("png") || file.endsWith("jpg"));

  return files;

  } catch(err) {
    console.error(err)
  }
}
export function test(): void {
  const ElectriaclAppliancesFiles = getFilesByFolder("Electrical appliances")

  console.log("EA", ElectriaclAppliancesFiles);
}

export const categoryFolderMap: Record<string, string[]> = {
  "11111111-1111-1111-1111-111111111111": ["Electrical appliances"],
  "22222222-2222-2222-2222-222222222222": ["book"],
  "33333333-3333-3333-3333-333333333333": ["food", "onigiri"],
  "44444444-4444-4444-4444-444444444444": ["drink", "coffee"],
}