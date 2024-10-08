package com.project.supershop.services.impls;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.project.supershop.services.FileUploadUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class FileUploadImpl implements FileUploadUtils {
    @Value("super-shop")
    private String bucketName;

    private AmazonS3 amazonS3;

    public FileUploadImpl(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    @Override
    public String uploadFile(MultipartFile imageFile, String brandImage) throws IOException {
//        System.out.println("Uploaded file content type: " + imageFile.getContentType());
//        if (!Arrays.asList("image/png", "image/jpeg").contains(imageFile.getContentType())) {
//            throw new IllegalStateException("File uploaded is not an image");
//        }

        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Type", imageFile.getContentType());
        metadata.put("Content-Length", String.valueOf(imageFile.getSize()));
        String path = String.format("%s/%s", bucketName, brandImage);
        String fileName = String.format("%s-%s", "ss-picture", UUID.randomUUID());
        String contentType = imageFile.getContentType();

        ObjectMetadata objectMetadata = new ObjectMetadata();
        Optional.of(metadata).ifPresent(map -> {
            if (!map.isEmpty()) {
                map.forEach(objectMetadata::addUserMetadata);
            }
        });
        objectMetadata.setContentType(contentType);
        try {
            amazonS3.putObject(path, fileName, imageFile.getInputStream(), objectMetadata);
            return fileName;
        } catch (AmazonServiceException e) {
            throw new IllegalStateException("Failed to upload the file", e);
        }
    }

    @Override
    public void deleteFile(String brandImage, String fileName) {
        if (fileName == null) {
            return;
        }

        String path = String.format("%s/%s", bucketName, brandImage);
        try {
            amazonS3.deleteObject(path, fileName);
        } catch (AmazonS3Exception e) {
            throw new IllegalStateException("Failed to delete the file", e);
        }
    }
}
