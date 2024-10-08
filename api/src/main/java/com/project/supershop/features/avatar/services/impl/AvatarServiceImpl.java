package com.project.supershop.features.avatar.services.impl;

import com.project.supershop.features.avatar.services.AvatarService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Transactional
public class AvatarServiceImpl implements AvatarService {

    @Override
    public Resource getFileResource(String filePath) {
        try{
            Path file = Paths.get(filePath);
            return new UrlResource(file.toUri());
        }catch(Exception e){
            throw new RuntimeException("Error while loading file image");
        }
    }
    @Override
    public void printData(String path){
        System.out.print("==========> " +path);
    }
}
