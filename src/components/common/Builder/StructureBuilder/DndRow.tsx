import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { DndTypes } from "../../../../constants";
import { DndItem } from "./DndItem";
import type { FC } from "react";
import type { DragItem } from "./types";

type Props = {
    items: string[];
    rowIndex: number;
    onMoveRow: (draggedRowIndex: number, targetRowIndex: number) => void;
    onDeleteItem: (rowIndex: number, itemIndex: number) => void;
    onMoveWithinRow: (rowIndex: number, draggedIndex: number, hoverIndex: number) => void;
    onMoveBetweenRows: (draggedIndex: number, targetRowIndex: number, sourceRowIndex: number) => void;
};

const DndRowContainer = styled.div<{ count: number }>`
    display: grid;
    grid-template-columns: repeat(${({ count }) => count}, ${({ count }) => 100/count}%);
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 6px;
    background-color: ${({ theme }) => theme.colors.brandShade10};
`;

const DndRow: FC<Props> = ({
    items,
    rowIndex,
    onMoveRow,
    onDeleteItem,
    onMoveWithinRow,
    onMoveBetweenRows,
}) => {
    const [, drop] = useDrop<DragItem>({
        accept: `item-${DndTypes.CONTACT}`,
        drop: (draggedItem) => onMoveBetweenRows(draggedItem.index, rowIndex, draggedItem.rowIndex),
      });

      const [, rowDrop] = useDrop<DragItem>({
        accept: `row-${DndTypes.CONTACT}`,
        hover: (draggedRow) => {
          if (draggedRow?.rowIndex !== rowIndex) {
            onMoveRow(draggedRow.rowIndex, rowIndex);
            draggedRow.rowIndex = rowIndex;
          }
        },
      });
    
      const [, drag] = useDrag({
        type: `row-${DndTypes.CONTACT}`,
        item: { rowIndex },
      });
    
      return (
        <div ref={(node) => drag(rowDrop(node))}>
            <DndRowContainer ref={drop} id="dnd-row" count={items.length}>
                {items.map((item: string, index: number) => (
                    <DndItem
                        key={index}
                        index={index}
                        item={item}
                        rowIndex={rowIndex}
                        onDeleteItem={onDeleteItem}
                        onMoveWithinRow={onMoveWithinRow}
                    />
                ))}
            </DndRowContainer>
        </div>
      );
};

export { DndRow };
