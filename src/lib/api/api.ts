import { pb } from "../pocketbase";
import { FileUploadObj } from "@/pages/_app/upload.lazy";

export const downloadBook = async (id: string) => {
    if (!getUserId()) return

    const fileToken = await pb.files.getToken();
    const record = await pb.collection(Collections.Books).getOne(id);
    const filename = record.file;
    return pb.files.getURL(record, filename, { 'download': true, 'token': fileToken });
}

export const uploadFile = async (upload: FileUploadObj) => {
    if (!getUserId()) return

    const data: UploadFileRequest = {
        user: getUserId()!,
        file: new File([upload.file], upload.file.name, { type: upload.file.type }),
    }

    if (upload.cover) {
        data.cover_image = new File([upload.cover], upload.cover.name, { type: upload.cover.type });
    }

    return await pb.collection(Collections.Books).create(data, { requestKey: upload.file.name });
}