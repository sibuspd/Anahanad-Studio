import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputPasswordProps = React.ComponentProps<"input">; // eslint-disable-line

const InputPassword = ({ className, ...props}: InputPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input {...props} className={cn(className)} type={showPassword? "text": "password"}/>
            <button type="button"
            onClick={ ()=> setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword? (<EyeOff size={18} className="text-muted-foreground"/>)
                : <Eye size={18} className="text-muted-foreground"/>}
            </button>
        </div>
    );
};

export default InputPassword;