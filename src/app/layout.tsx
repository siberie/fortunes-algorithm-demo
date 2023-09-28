import {type PropsWithChildren} from "react";
import "~/styles/globals.css";

const Layout = ({children}: PropsWithChildren) => {
    return (
        <html>
        <body className="w-screen h-screen">
        <div className="p-10 flex w-full h-full">
            {children}
        </div>
        </body>
        </html>
    );
}

export default Layout