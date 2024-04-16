import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename =  file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/11-04-2024" + filename),
      buffer
    );
    
    const jsonFilename = filename.replace(/\.[^/.]+$/, ".json");
    console.log('json!!!!');
    const jsonData = {
      fileUrl: `/uploads/11-04-2024/${filename}`,
      pageCount: 10, // 예시로 임의의 페이지 수를 설정
      extension: file.name.split(".").pop()
    };
    // path.join(process.cwd(), "public/jsons" + jsonFilename),
    // buffer
    await writeFile(
      path.join(process.cwd(), "public/jsons" + filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
