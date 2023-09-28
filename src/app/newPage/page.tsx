import clsx from "clsx";
import {type ReactNode} from "react";

type WrapperProps = {
    children: ReactNode
    className?: string
    selected?: boolean
}

const Wrapper = (props: WrapperProps) => {
    return (
        <div className={clsx(
            "bg-white border rounded shadow p-10 grow",
            props.className, {
                "bg-red-100": props.selected
            })}>
            {props.children}
        </div>
    )
}

const Page = () => {
    return (
        <div className="h-full">
            <header className="h-28 bg-amber-500 flex flex-row justify-start items-center px-10">
                <h1 className="text-4xl text-white font-bold text-center">Hello world!</h1>
            </header>
            <div className="flex flex-row gap-10 p-10 bg-neutral-100">
                <Wrapper selected>
                    <h1>Hot reload!!</h1>
                </Wrapper>
                <Wrapper>
                    <h1>Hot reload!!</h1>
                </Wrapper>
            </div>
        </div>
    )
}

export default Page