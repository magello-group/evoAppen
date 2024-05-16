import { useMemo } from "react";
import { LoginCard } from "./LoginCard";


export const Header = (props: { title: string; titleSize: "l" | string, description: string, hideLogin?: boolean }) => {
    const { title, titleSize, description = "abc", hideLogin = false } = props;

    const sizeClass = useMemo(() => {
        switch (titleSize) {
            case 'xl':
                return 'text-4xl lg:text-5xl';
            case 'l':
                return 'text-3xl lg:text-4xl';
            default:
                return 'text-xl lg:text-2xl';
        }
    }, [titleSize]);

    return (
        <div className="flex justify-between py-8 ">
            <div>
                <h1 className={`scroll-m-20 font-extrabold tracking-tight lg:text-5xl ${sizeClass}`}>
                    {title}
                </h1>
                <p className="text-slate-500 mt-4">
                    {description}
                </p>
            </div>
            {!hideLogin && <LoginCard />}
        </div >
    );
};
