import { Outlet } from "@remix-run/react";
import TournamentsList from "./tournaments-list";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserLoggedIn } from "~/lib/session.server";
import { useRevalidateOnGlobalTournamentUpdate } from "../sse/hook";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUserLoggedIn(request)
    return null
}

export default function Tournaments() {
    useRevalidateOnGlobalTournamentUpdate()

    return <div className="is-full-height is-flex-row gap-3 p-3">
        <TournamentsList />
        <Outlet />
    </div>
}