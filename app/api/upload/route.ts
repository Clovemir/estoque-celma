import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return NextResponse.json(
      { error: "Cloudinary não configurado" },
      { status: 500 }
    );
  }

  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { error: "Arquivo não enviado" },
      { status: 400 }
    );
  }

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const cloudForm = new FormData();
  cloudForm.append("file", file);
  cloudForm.append("upload_preset", uploadPreset);

  const cloudRes = await fetch(cloudinaryUrl, {
    method: "POST",
    body: cloudForm,
  });

  if (!cloudRes.ok) {
    const errorText = await cloudRes.text();
    console.error("Cloudinary error", errorText);
    return NextResponse.json(
      { error: "Falha no upload da imagem" },
      { status: 500 }
    );
  }

  const data = await cloudRes.json();

  return NextResponse.json({
    url: data.secure_url as string,
  });
}

