import * as React from "react";
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from "react-native";

interface SwitchProps extends Omit<RNSwitchProps, "value" | "onValueChange"> {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const Switch = React.forwardRef<RNSwitch, SwitchProps>(
  ({ value, onValueChange, ...props }, ref) => (
    <RNSwitch
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#d4d4d8", true: "#16a34a" }}
      thumbColor="#ffffff"
      {...props}
    />
  )
);
Switch.displayName = "Switch";

export { Switch };
