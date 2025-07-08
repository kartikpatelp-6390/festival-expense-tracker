const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

exports.uploadToS3 = async (buffer, filename, mimetype = 'application/pdf') => {
    const key = `receipts/${filename}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        // ACL: 'public-read',
    };

    await s3.upload(params).promise();

    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}