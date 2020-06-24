package com.ford.labs.retroquest.converters;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

@Converter(autoApply = false)
public class LocalDateTimeAttributeConverter implements AttributeConverter<LocalDateTime, Timestamp> {

    @Override
    public Timestamp convertToDatabaseColumn(LocalDateTime locDateTime) {
        return Optional.ofNullable(locDateTime)
                .map(Timestamp::valueOf)
                .orElse(null);
    }

    @Override
    public LocalDateTime convertToEntityAttribute(Timestamp sqlTimestamp) {
        return Optional.ofNullable(sqlTimestamp)
                .map(Timestamp::toLocalDateTime)
                .orElse(null);
    }
}