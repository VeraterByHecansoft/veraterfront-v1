import { useAPIContext } from "@/auth/useAPIContext";
import { ISaldos } from "@/partials/heros/types";
import { UserType } from "@/types/authTypes";
import { toAbsoluteUrl } from "@/utils";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router";
import { Container } from "@/components";
import { MemberProfileHero } from "@/partials/heros/MemberProfileHero";
import { MembersAccountPageContent } from "./MembersAccountPageContent";
import { SkeletonTable } from "../../stp";
import { useAuthContext } from "@/auth";

const MembersAccountPage = memo(() => {
    const { id } = useParams<{ id: string }>();
    const { get } = useAPIContext();
    const [user, setUser] = useState<UserType | undefined>(undefined);
    const { user: autUser } = useAuthContext()
    const [saldos, setSaldos] = useState<ISaldos | undefined>(undefined);
    const hasFetched = useRef(false); // ← Aquí está tu ref
    if (!['admin', 'owner'].includes(`${autUser?.tipo}`)) {
        return <Navigate to="/panel" replace />;
    }

    const [image, setImage] = useState(<img
        src={toAbsoluteUrl(`/media/avatars/blank.png`)}
        className="rounded-full border-3 border-success size-[100px] shrink-0"
    />)

    useEffect(() => {
        if (id && !hasFetched.current) {
            hasFetched.current = true;
            get(`/member/${id}`, {}).then((data: any) => {
                const USER = data.data;

                const avatar = USER.imgperf ? `https://rute.mx/D?u=${USER.imgperf}&t=1` : toAbsoluteUrl(`/media/avatars/${'blank.png'}`)
                setImage(
                    <img onClick={() => { }}
                        src={avatar}
                        className="rounded-full border-3 border-success size-[100px] shrink-0"
                    />)
                setUser(data.data)
                loadSaldos(USER.USR)
            }).catch(err => {
                console.error('Error al cargar perfil:', err.message);
            })
        }
    }, [id])

    const loadSaldos = (USR: string) => {
        get(`/member/saldos/${USR}`).then((data: any) => {
            const saldos = data?.data as ISaldos
            setSaldos(saldos)
        }).catch(err => { })
    }

    return (
        <Fragment>
            {user && <MemberProfileHero
                name={`${user?.APP} ${user?.APM}`}
                image={image}
                info={[
                    { label: user?.nombres, icon: 'heroicons-outline:user' },
                    { phone: user?.cel, icon: 'heroicons-outline:phone' },
                    { email: user?.email, icon: 'heroicons-outline:at-symbol' },
                ]}
                saldos={saldos}
                member={user}
            />}
            <Container>
            </Container>
            <Container>
                {user && saldos ? <MembersAccountPageContent saldos={saldos} user={user} /> : <SkeletonTable />}
            </Container>
        </Fragment>
    );
});

export { MembersAccountPage }