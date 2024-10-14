import { useState, useCallback } from "react";
import styled from "styled-components";
import { DndRow } from "./DndRow";
import { AddItemDropdown } from "./AddItemDropdown";
import type { FC } from "react";
import type { MetaMap } from "./types";
import type { Layout } from "../types";

type Props = {
    onChange: (structure: Layout) => void;
    items: string[];
    structure?: Layout;
    meta?: MetaMap;
};

const DndContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px dashed ${({ theme }) => theme.colors.brandShade50};
    padding: 3px;
    margin-bottom: 10px;
`;

const StructureBuilder: FC<Props> = ({ structure, items, onChange, meta }) => {
    const [rows, setRows] = useState(structure ?? []);
    const [activeRow, setActiveRow] = useState<number|null>(null);

    const onMoveBetweenRows = (draggedIndex: number, targetRowIndex: number, sourceRowIndex: number) => {
        if (sourceRowIndex === targetRowIndex) {
            return;
        }
    
        let newRows = [...rows];
        const [draggedItem] = newRows[sourceRowIndex].splice(draggedIndex, 1);
        newRows[targetRowIndex].push(draggedItem);
        newRows = newRows.filter((row) => Boolean(row.length));
        onChange(newRows);
        setRows(newRows);
    };
    
    const onMoveWithinRow = useCallback((rowIndex: number, draggedIndex: number, hoverIndex: number) => {
        setRows((prevRows) => {
            const newRows = [...prevRows];
            const [draggedItem] = newRows[rowIndex].splice(draggedIndex, 1);
            newRows[rowIndex].splice(hoverIndex, 0, draggedItem);
            onChange(newRows);
            return newRows;
        });
    }, [onChange]);

    const onAddItem = useCallback((item: string) => {
        setRows((prevRows) => {
            const newRows = [ ...prevRows, [item] ];
            onChange(newRows);
            return newRows;
        });
    }, [onChange]);

    const onDeleteItem = (rowIndex: number, itemIndex: number) => {
        let newRows = [...rows];
        newRows[rowIndex].splice(itemIndex, 1);
        newRows = newRows.filter((row) => Boolean(row.length));
        onChange(newRows);
        setRows(newRows);
    };

    const onMoveRow = (draggedRowIndex: number, targetRowIndex: number) => {
        const newRows = [...rows];
        const [draggedRow] = newRows.splice(draggedRowIndex, 1);
        newRows.splice(targetRowIndex, 0, draggedRow);
        onChange(newRows);
        setRows(newRows);
      };

    return (
        <>
            <DndContainer>
                {rows.map((items, rowIndex) => (
                    <DndRow
                        meta={meta}
                        key={rowIndex}
                        items={items}
                        rowIndex={rowIndex}
                        onMoveRow={onMoveRow}
                        onMoveBetweenRows={onMoveBetweenRows}
                        onMoveWithinRow={onMoveWithinRow}
                        onDeleteItem={onDeleteItem}
                        activeRow={activeRow}
                        onChangeActiveRow={setActiveRow}
                    />
                ))}
            </DndContainer>
            <AddItemDropdown meta={meta} items={items} onAddItem={onAddItem} />
        </>
    );
};

export { StructureBuilder };
