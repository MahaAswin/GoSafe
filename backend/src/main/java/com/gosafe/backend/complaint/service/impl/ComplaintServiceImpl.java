package com.gosafe.backend.complaint.service.impl;

import com.gosafe.backend.complaint.dto.ComplaintRequestDTO;
import com.gosafe.backend.complaint.dto.ComplaintResponseDTO;
import com.gosafe.backend.complaint.entity.Complaint;
import com.gosafe.backend.complaint.enums.ComplaintStatus;
import com.gosafe.backend.complaint.mapper.ComplaintMapper;
import com.gosafe.backend.complaint.repository.ComplaintRepository;
import com.gosafe.backend.complaint.service.ComplaintService;
import com.gosafe.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation managing complaint operations using Database access.
 */
@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;

    @Override
    @Transactional
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO request) {
        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .imageUrl(request.getImageUrl())
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);
        return complaintMapper.toDTO(savedComplaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getAllComplaints() {
        return complaintRepository.findAll()
                .stream()
                .map(complaintMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponseDTO getComplaintById(UUID id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint with ID " + id + " was not found."));
        return complaintMapper.toDTO(complaint);
    }

    @Override
    @Transactional
    public ComplaintResponseDTO updateComplaint(UUID id, ComplaintRequestDTO request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint with ID " + id + " was not found."));

        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setAddress(request.getAddress());
        complaint.setImageUrl(request.getImageUrl());

        Complaint updatedComplaint = complaintRepository.save(complaint);
        return complaintMapper.toDTO(updatedComplaint);
    }

    @Override
    @Transactional
    public void deleteComplaint(UUID id) {
        if (!complaintRepository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint with ID " + id + " was not found.");
        }
        complaintRepository.deleteById(id);
    }
}
