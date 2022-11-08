import { FC } from "react";
import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
    Input,
    DatePicker,
    DateTimePicker,
    DatePickerProps,
    useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { Label } from "../Label";
import "./DateField.css";

export type MappedFieldProps = DatePickerProps & {
    id: string;
    label: string,
    error: boolean,
    value?: string,
    required?: boolean,
    withTime?: boolean,
    onChange: (date: [Date]) => void,
}

const LabelDate = styled(Label)``;

const DateInput = styled(Input)`
    :read-only {
      cursor: pointer;
    }
`;

export const DateField: FC<MappedFieldProps> = ({
    id,
    label,
    value,
    error,
    required,
    onChange,
    withTime,
    ...props
}: MappedFieldProps) => {
    const { theme } = useDeskproAppTheme();
    const Picker = withTime ? DateTimePicker : DatePicker;
    const options = {
        position: "left",
        dateFormat: "d/m/Y",
        ...(!withTime ? {} : {
            altInput: true,
            altFormat: "j F Y H:i",
            timeFormat: "H:i",
        }),
    };

    return (
        <Picker
            options={options}
            value={value}
            onChange={onChange}
            {...props}
            render={(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _: any, ref: any
            ) => (
                <LabelDate
                    required={required}
                    htmlFor={id}
                    label={label}
                >
                    <DateInput
                        id={id}
                        ref={ref}
                        error={error}
                        variant="inline"
                        inputsize="small"
                        placeholder="DD/MM/YYYY"
                        rightIcon={{
                            icon: faCalendarDays,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            style: {
                                color: theme.colors.grey40,
                            }
                        }}
                    />
                </LabelDate>
            )}
        />
    );
}
