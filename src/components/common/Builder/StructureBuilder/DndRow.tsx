import { useEffect } from "react";
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
    activeRow: number|null;
    onChangeActiveRow: (idx: number|null) => void;
};

const DndRowContainer = styled.div<{ count: number, isDragging: boolean }>`
    display: grid;
    grid-template-columns: repeat(${({ count }) => count}, ${({ count }) => 100/count}%);
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 6px;
    background-color: ${({ theme }) => theme.colors.brandShade10};
    cursor: move;

    position: relative;
    transition: transform 1s ease;
    /*
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: ${({ isDragging }) => (isDragging ? 0.8 : 1)};
    transform: ${({ isDragging }) => (isDragging ? "rotate(1deg)" : "rotate(0deg)")};
    */
`;

const Placeholder = styled.div`
    box-sizing: border-box;
    display: flex;
    gap: 6px;
    justify-content: space-between;
    align-items: center;
    margin-left: 6px;
    /* border: 1px solid ${({ theme }) => theme.colors.brandShade50}; */
    border-radius: 4px;
    /* background-color: ${({ theme }) => theme.colors.white}; */
    background-color: transparent;
    border: 1px dashed ${({ theme }) => theme.colors.brandShade50};
    margin-left: 6px;
`;

const DndRow: FC<Props> = ({
    items,
    rowIndex,
    onMoveRow,
    activeRow,
    onDeleteItem,
    onMoveWithinRow,
    onMoveBetweenRows,
    onChangeActiveRow,
}) => {
    const isNeedPlaceholder = (activeRow !== null && activeRow === rowIndex);

    const [{ isOver }, drop] = useDrop<DragItem>({
        accept: `item-${DndTypes.CONTACT}`,
        drop: (draggedItem) => onMoveBetweenRows(draggedItem.index, rowIndex, draggedItem.rowIndex),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
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
    
      const [{ isDragging }, drag] = useDrag({
        type: `row-${DndTypes.CONTACT}`,
        item: { rowIndex },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      });

      useEffect(() => {
        onChangeActiveRow(isOver ? rowIndex : null);
      }, [isOver, rowIndex, onChangeActiveRow]);
    
      return (
        <div ref={(node) => drag(rowDrop(node))}>
            <DndRowContainer
              ref={drop}
              id="dnd-row"
              isDragging={isDragging}
              count={items.length + (isNeedPlaceholder ? 1 : 0)}
            >
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
                {isNeedPlaceholder && (
                  <Placeholder/>
                )}
            </DndRowContainer>
        </div>
      );
};

export { DndRow };
