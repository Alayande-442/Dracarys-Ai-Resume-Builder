import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler } from "react-color";

interface colorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}
export default function ColorPicker({ color, onChange }: colorPickerProps) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="change resume color"
          onClick={() => setShowPopover(true)}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
}
