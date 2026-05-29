import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGrip, IconX } from './Icons';

type SortableGalleryItemProps = {
  id: string;
  url: string;
  index: number;
  disabled?: boolean;
  onRemove: (index: number) => void;
};

function SortableGalleryItem({ id, url, index, disabled, onRemove }: SortableGalleryItemProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`gallery-item${isDragging ? ' gallery-item--dragging' : ''}`}
    >
      <img src={url} alt="" className="thumb gallery-item-image" draggable={false} />
      <span className="gallery-item-index">{index + 1}</span>
      <button
        type="button"
        className="gallery-item-remove"
        onClick={() => onRemove(index)}
        disabled={disabled}
        aria-label={`Görsel ${index + 1} kaldır`}
      >
        <IconX size={12} />
      </button>
      <button
        type="button"
        ref={setActivatorNodeRef}
        className="gallery-item-handle"
        {...attributes}
        {...listeners}
        disabled={disabled}
        aria-label={`Görsel ${index + 1} sırasını değiştir`}
      >
        <IconGrip size={14} />
      </button>
    </div>
  );
}

type GalleryGridProps = {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
};

export default function GalleryGrid({ images, onChange, disabled }: GalleryGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.indexOf(String(active.id));
    const newIndex = images.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onChange(arrayMove(images, oldIndex, newIndex));
  };

  const onRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="gallery-section">
      <p className="gallery-hint">Sıralamayı değiştirmek için tutamacı sürükleyin · Kaldırmak için × kullanın</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="gallery-grid">
            {images.map((url, index) => (
              <SortableGalleryItem
                key={url}
                id={url}
                url={url}
                index={index}
                disabled={disabled}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
