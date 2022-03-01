package com.ford.labs.retroquest.column;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping
@Tag(name = "Column Controller", description = "The controller that manages the columns of a retro")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping("/api/team/{teamId}/columns")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Gets all columns of a retro board for a given Team ID", description = "getColumns")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "403", description = "Forbidden")})
    public List<Column> getColumns(@PathVariable String teamId) {
        return columnService.getColumns(teamId);
    }

    @Transactional
    @PutMapping("/api/team/{teamId}/column/{columnId}/title")
    @PreAuthorize("@apiAuthorization.requestIsAuthorized(authentication, #teamId)")
    @Operation(summary = "Updates the title of a column of a retro board given a team id and column id", description = "updateTitleOfColumn")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "OK")})
    public void updateTitleOfColumn(@PathVariable("teamId") String teamId, @RequestBody UpdateColumnTitleRequest request, @PathVariable("columnId") Long columnId) {
        columnService.editColumnTitleName(columnId, request.getTitle(), teamId);
    }
}
