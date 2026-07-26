package com.gosafe.backend.complaint.service;

import com.gosafe.backend.complaint.dto.ComplaintRequestDTO;
import com.gosafe.backend.complaint.dto.ComplaintResponseDTO;
import java.util.List;
import java.util.UUID;

/**
 * Service interface specifying all complaint management actions.
 */
public interface ComplaintService {

    /**
     * Creates a new citizen complaint.
     *
     * @param request Input details.
     * @return Generated complaint details.
     */
    ComplaintResponseDTO createComplaint(ComplaintRequestDTO request);

    /**
     * Retrieves all complaints registered in the system.
     *
     * @return List of all complaints.
     */
    List<ComplaintResponseDTO> getAllComplaints();

    /**
     * Retrieves specific complaint details based on its unique ID.
     *
     * @param id Unique ID of the complaint.
     * @return Matching complaint details.
     */
    ComplaintResponseDTO getComplaintById(UUID id);

    /**
     * Updates an existing complaint.
     *
     * @param id Unique ID of the complaint.
     * @param request Updated inputs.
     * @return Updated complaint details.
     */
    ComplaintResponseDTO updateComplaint(UUID id, ComplaintRequestDTO request);

    /**
     * Deletes a specific complaint.
     *
     * @param id Unique ID of the complaint.
     */
    void deleteComplaint(UUID id);
}
