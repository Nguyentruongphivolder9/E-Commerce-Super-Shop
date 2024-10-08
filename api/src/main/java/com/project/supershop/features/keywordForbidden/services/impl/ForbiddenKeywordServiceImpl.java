package com.project.supershop.features.keywordForbidden.services.impl;

import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordRequest;
import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordResponse;
import com.project.supershop.features.keywordForbidden.domain.entities.ForbiddenKeyword;
import com.project.supershop.features.keywordForbidden.repositories.ForbiddenKeywordRepository;
import com.project.supershop.features.keywordForbidden.services.ForbiddenKeywordService;
import com.project.supershop.handler.ConflictException;
import com.project.supershop.handler.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ForbiddenKeywordServiceImpl implements ForbiddenKeywordService {
    private final ForbiddenKeywordRepository forbiddenKeywordRepository;
    private final ModelMapper modelMapper;

    public ForbiddenKeywordServiceImpl(ForbiddenKeywordRepository forbiddenKeywordRepository, ModelMapper modelMapper) {
        this.forbiddenKeywordRepository = forbiddenKeywordRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ForbiddenKeywordResponse createForbiddenKeyword(ForbiddenKeywordRequest formRequest) {
        Optional<ForbiddenKeyword> keywordOptional = forbiddenKeywordRepository.findByKeyword(formRequest.getKeyword());
        if(keywordOptional.isPresent()) {
            throw new ConflictException(formRequest.getKeyword() + " already exists.");
        }

        ForbiddenKeyword forbiddenKeyword = ForbiddenKeyword.createForbiddenKeyword(formRequest);
        ForbiddenKeyword result = forbiddenKeywordRepository.save(forbiddenKeyword);
        return modelMapper.map(result, ForbiddenKeywordResponse.class);
    }

    @Override
    public ForbiddenKeywordResponse editForbiddenKeyword(ForbiddenKeywordRequest formRequest) {
        Optional<ForbiddenKeyword> keywordOptional = forbiddenKeywordRepository.findByKeyword(formRequest.getKeyword());
        if(keywordOptional.isPresent()) {
            throw new ConflictException(formRequest.getKeyword() + " already exists.");
        }

        Optional<ForbiddenKeyword> updateKeywordOptional = forbiddenKeywordRepository.findById(UUID.fromString(formRequest.getId()));
        if(updateKeywordOptional.isEmpty()) {
            throw new NotFoundException(formRequest.getId() + " dose not exists.");
        }
        ForbiddenKeyword updateForm = updateKeywordOptional.get();
        updateForm.setKeyword(formRequest.getKeyword());
        ForbiddenKeyword result = forbiddenKeywordRepository.save(updateForm);
        return modelMapper.map(result, ForbiddenKeywordResponse.class);
    }

    @Override
    public List<ForbiddenKeywordResponse> getListProduct() {
        List<ForbiddenKeyword> list = forbiddenKeywordRepository.findAll();
        return list.stream()
                .map(result -> modelMapper.map(result, ForbiddenKeywordResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteListForbiddenKeyword(List<String> forbiddenKeywordIds) {
        List<ForbiddenKeyword> forbiddenKeywordList = new ArrayList<>();
        for (String id : forbiddenKeywordIds){
            Optional<ForbiddenKeyword> updateKeywordOptional = forbiddenKeywordRepository.findById(UUID.fromString(id));
            forbiddenKeywordList.add(updateKeywordOptional.get());
        }

        forbiddenKeywordRepository.deleteAll(forbiddenKeywordList);
    }
}
