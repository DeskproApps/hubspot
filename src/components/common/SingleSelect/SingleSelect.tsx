import { FC, useEffect, useState, useMemo } from "react";
import {
    faCheck,
    faCaretDown,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    Dropdown,
    DropdownValueType,
    DropdownTargetProps,
    DivAsInputWithDisplay,
} from "@deskpro/deskpro-ui";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SingleSelect: FC<any> = ({
    id,
    label,
    error,
    value,
    options,
    onChange,
    required,
    placeholder,
    showInternalSearch,
    ...props
}) => {
    const [input, setInput] = useState<string>("");
    const [dirtyInput, setDirtyInput] = useState<boolean>(false);

    const selectedValue = useMemo(() => {
        return options.filter((o: DropdownValueType<string|number>) => o.value === value?.value)[0]?.label ?? "";
    }, [value, options]);

    useEffect(() => {
        setInput(value?.label || "Select Value");
    }, [value]);

    return (
        <Dropdown
            showInternalSearch={showInternalSearch}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            hideIcons
            inputValue={!dirtyInput ? "" : input}
            onSelectOption={(selectedOption) => {
                if (!dirtyInput && showInternalSearch) {
                    setDirtyInput(true);
                }
                onChange(selectedOption);
            }}
            onInputChange={(value) => {
                if (showInternalSearch) {
                    !dirtyInput && setDirtyInput(true);
                    setInput(value);
                }
            }}
            options={options.filter((option: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                return !dirtyInput
                    ? true
                    : option.label.toLowerCase().includes(input.toLowerCase());
            })}
            {...props}
        >
            {({ targetRef, targetProps }: DropdownTargetProps<HTMLDivElement>) => {
                return (
                    <DivAsInputWithDisplay
                        id={id}
                        placeholder={placeholder || "Select Value"}
                        value={selectedValue}
                        variant="inline"
                        rightIcon={faCaretDown}
                        error={error}
                        ref={targetRef}
                        {...targetProps}
                        isVisibleRightIcon={false}
                    />
                )
            }}
        </Dropdown>
    );
};

export { SingleSelect };
