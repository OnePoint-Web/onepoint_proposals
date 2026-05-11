import styles from './Pagination.module.scss'

export default function Pagination({totalPages, currentPage, setPage}){

    const maxVisiblePages = 5;

    let startPage = Math.max(
    currentPage - Math.floor(maxVisiblePages / 2),
    1
    );

    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
    endPage = totalPages;

    startPage = Math.max(
        endPage - maxVisiblePages + 1,
        1
    );
    }

    const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
    );

    return (
        <div className={styles['pagination-container']}>

            <div className={styles['pagination']}>

                <button
                    className={styles['next-back-btns']}
                    disabled={currentPage === 1}
                    onClick={() => {
                        setPage(prev => ({
                        ...prev,
                        page: prev.page - 1,
                        }));
                    }}
                >
                {'<'}
                </button>

                {visiblePages.map((page) => (
                    <div
                        key={page}
                        className={`${styles['pagination-button']} ${
                        currentPage === page
                            ? styles['active']
                            : ''
                        }`}
                        onClick={() => {
                        setPage(prev => ({
                            ...prev,
                            page,
                        }));
                        }}
                    >
                        <p>{page}</p>
                    </div>
                ))}

                <button
                    className={styles['next-back-btns']}
                    disabled={currentPage === totalPages}
                    onClick={() => {
                        setPage(prev => ({
                        ...prev,
                        page: prev.page + 1,
                        }));
                    }}
                >
                {'>'}
                </button>
            </div>
        </div>
    )
}
