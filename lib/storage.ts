
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const bucket = process.env.S3_BUCKET;

function getStorageConfig() {
  if (
    !endpoint ||
    !region ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket
  ) {
    throw new Error(
      "Configuração do armazenamento de imagens incompleta no Railway."
    );
  }

  return {
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle:
      process.env.S3_URL_STYLE?.toLowerCase() === "path",
  };
}

let storageClient: S3Client | null = null;

function getStorageClient() {
  if (!storageClient) {
    storageClient = new S3Client(getStorageConfig());
  }

  return storageClient;
}

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export function validateImage(
  contentType: string,
  size: number
): boolean {
  return (
    Object.prototype.hasOwnProperty.call(
      allowedTypes,
      contentType
    ) &&
    size > 0 &&
    size <= MAX_IMAGE_SIZE
  );
}

export function createVehicleImageKey(
  vehicleId: string,
  contentType: string
) {
  const extension = allowedTypes[contentType];

  if (!extension) {
    throw new Error("Formato de imagem não permitido.");
  }

  return `vehicles/${vehicleId}/${randomUUID()}.${extension}`;
}

export async function uploadVehicleImage(
  key: string,
  body: Buffer,
  contentType: string
) {
  await getStorageClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function deleteVehicleImage(key: string) {
  await getStorageClient().send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

export async function createImageDownloadUrl(
  key: string
): Promise<string> {
  return getSignedUrl(
    getStorageClient(),
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    {
      expiresIn: 3600,
    }
  );
}
