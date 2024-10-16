import { useEffect, useState, useMemo } from "react";
import {
    faCheck,
    faCaretDown,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    Dropdown,
    DropdownProps,
    DropdownValueType,
    DropdownHeaderType,
    DropdownTargetProps,
    DivAsInputWithDisplay,
} from "@deskpro/deskpro-ui";

type Props<T> = Omit<
    DropdownProps<T, HTMLElement>,
    "fetchMoreText"|"autoscrollText"|"selectedIcon"|"externalLinkIcon"|"options"|"children"
> & {
    id: string;
    onChange: (o: DropdownValueType<T>) => void;
    value: DropdownValueType<T>;
    options: Array<DropdownValueType<T> | DropdownHeaderType>;
    error?: boolean;
    placeholder?: string;
};

const SingleSelect = <T,>({
    id,
    error,
    value,
    options,
    onChange,
    placeholder,
    showInternalSearch, 
    ...props
}: Props<T>) => {
    const [input, setInput] = useState<string>("");
    const [dirtyInput, setDirtyInput] = useState<boolean>(false);

    const selectedValue = useMemo(() => {
        const filtered = options.filter((o) => {
            return (o?.type === "value") && (o.value === value?.value);
        }) as Array<DropdownValueType<T>>;
        const firstOption = filtered[0];
        return firstOption?.label || "";
    }, [value, options]);

    useEffect(() => {
        setInput(`${value.label as string}` || "Select Value");
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
            options={options.filter((option) => {
                return !dirtyInput
                    ? true
                    : `${option?.label as string || ""}`.toLowerCase().includes(input.toLowerCase());
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
