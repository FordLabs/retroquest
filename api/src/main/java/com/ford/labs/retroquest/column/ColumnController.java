package com.ford.labs.retroquest.column;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
