package com.project.supershop.features.avatar.services;

import org.springframework.core.io.Resource;

public interface AvatarService {
    Resource getFileResource(String filePath);
    void printData(String data);
}
