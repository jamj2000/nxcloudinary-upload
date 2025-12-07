'use server'
/*
Este código funciona en localhost, pero no en Vercel
Referencia: https://community.cloudinary.com/discussion/432/image-upload-from-api-route-on-cloudinary-works-on-localhost-but-not-on-vercel-production
*/

import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloudinary.config(process.env.CLOUDINARY_URL || '')

export async function uploadFile(prevState, formData) {
    const file = formData.get('file')

    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    try {
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream((error, result) => {
                    if (error) return reject(error)
                    else return resolve(result)
                })
                .end(bytes);
        })

        const result = await cloudinary.uploader
            .rename(uploadResult.public_id, file.name, { overwrite: true })

        return { success: 'Archivo subido' }

    } catch (error) {
        return { error: error.message }
    }
}