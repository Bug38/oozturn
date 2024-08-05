import { Link, useLocation, useSubmit } from "@remix-run/react"
import { useContext, useState } from "react"
import { useLan } from "../contexts/LanContext"
import { UserContext } from "../contexts/UserContext"
import { DropDownArrowSVG, EditGearSVG, LogoFolded, LogoSideSVG } from "../data/svg-container"
import { UserAvatar } from "../elements/user-avatar"
import EditProfileModal from "../user/edit-profile-modal"
import { clickorkey } from "~/lib/utils/clickorkey"


export default function Navbar() {

    const lan = useLan()
    const user = useContext(UserContext)
    const [showMobileNav] = useState(false)
    const [animateLogo, setAnimateLogo] = useState(false)
    const current_page: string = useLocation().pathname
    const loading = false

    if (!user) return null

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
    async function animateLogoFunc() {
        setAnimateLogo(true)
        await delay(2300)
        setAnimateLogo(false)
    }

    return (
        <>
            <nav className="navbar has-background-secondary-level">
                <div className="navbar-brand is-title big">
                    <Link className="navbar-item pl-0" to="/">
                        <div style={{ height: "25px", width: "180px" }} className="p-0 navbarLogo is-flex" onMouseEnter={animateLogoFunc}>
                            <LogoFolded animate={animateLogo} />
                        </div>
                        <LogoSideSVG />
                        {lan?.name}
                    </Link>
                </div>
                <div className={`navbar-menu ${showMobileNav && "is-active"}`}>
                    <div className="navbar-end">
                        {user?.isAdmin && <Link className={`navbar-item is-title medium is-uppercase is-tab px-0 mx-3 ${current_page == "/admin" ? 'is-active' : ''}`} to="/admin">Admin</Link>}
                        {user && <Link className={`navbar-item is-title medium is-uppercase is-tab px-0 mx-3 ${current_page == "/" ? 'is-active' : ''}`} to="/">Accueil</Link>}
                        {user && <Link className={`navbar-item is-title medium is-uppercase is-tab px-0 mx-3 ${current_page == "/results" ? 'is-active' : ''}`} to="/results">Résultats</Link>}
                        <div className="navbar-item m-4"></div>
                        {loading ? "" :
                            user ?
                                <UserProfile />
                                :
                                <></>
                        }
                    </div>
                </div>
            </nav >
        </>
    )
}

export function UserProfile() {

    const submit = useSubmit()
    const me = useContext(UserContext)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaderboard: any[] = []
    const [showEdit, setShowEdit] = useState(false)

    if (!me) {
        return null
    }

    function handleLogout() {
        submit(null, {
            action: "/logout",
            method: "POST"
        })
    }

    return (
        <>
            <div className="navbar-item navbar-user p-0 m-0 is-flex">
                <div className="navbar-item navbar-user-button is-clickable has-background-secondary-accent p-0 m-0 is-flex is-flex-grow-1">
                    <div className="username mr-4 is-flex-grow-1 has-text-centered">{me.username}</div>
                    <div className="arrow mr-4">
                        <DropDownArrowSVG />
                    </div>
                    <div className="avatar">
                        <UserAvatar username={me.username} avatar={me.avatar} />
                    </div>
                </div>
                <div className="navbarUserInfoTopBox has-background-secondary-level is-flex is-flex-direction-column is-align-items-center p-0">
                    <div className="settings is-clickable fade-on-mouse-out" {...clickorkey(() => setShowEdit(true))}>
                        <EditGearSVG />
                    </div>
                    <div className="avatar mt-6">
                        <UserAvatar username={me.username} avatar={me.avatar} />
                    </div>
                    <div>{me.username}</div>
                    {me.team && <div className="userteam fade-text">{'[' + me.team + ']'}</div>}
                    {leaderboard &&
                        <div className="is-flex is-full-width mt-5 is-align-items-end">
                            <div className="logout is-size-7 px-1 is-underlined is-clickable fade-on-mouse-out" {...clickorkey(handleLogout)}>Se déconnecter</div>
                            <div className="is-flex-grow-1"></div>
                            <div className="is-flex points is-align-items-start">
                                <div>{leaderboard.find(p => p.player.username == me.username)?.points || 0}</div>
                                <div className="is-size-7 p-1">pts</div>
                            </div>
                        </div>
                    }
                    <div className="m-1"></div>

                </div>
            </div>
            <EditProfileModal show={showEdit} onHide={() => setShowEdit(false)} />
        </>
    )
}