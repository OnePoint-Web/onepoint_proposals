import styles from './components.module.scss'

export default function OurTeam({ proposal }) {
    return (
        <div className={styles.section}>
            <div className={styles['team-body']}>
                <div className={styles['section-head']}>
                    <p className={styles['section-title']}>THE TEAM</p>
                    <hr />
                </div>

                <div className={styles['team-grid']}>
                    {proposal.selectedMembers.map((m, i) => (
                        <div key={i} className={styles['team-card']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={m.teamMember.memberImage || '/profile-placeholder.png'} alt={m.teamMember.memberName} />
                            <div className={styles['team-card-info']}>
                                <p className={styles['team-name']}>{m.teamMember.memberName}</p>
                                <p className={styles['team-role']}>{m.teamMember.memberRole}</p>
                                {m.teamMember.description && (
                                    <p className={styles['team-desc']}>{m.teamMember.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
