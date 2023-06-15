import React from 'react';
import s from './SuperPaginator.module.css';
import {PaginatorButton, PaginatorButtonType} from "./PaginatorButton/PaginatorButton";

type VectorType = 'down' | 'up';
type JumpType = 'byOne' | 'bigJump';
type PaginatorPropsType = {
    viewPagesOddNumber: number
    pageJumpPositive: number

    currentPage: number
    totalPage: number

    setCurrentPage: (currentPage: number) => void
};

const SuperPaginator: React.FC<PaginatorPropsType> = ({viewPagesOddNumber, pageJumpPositive, currentPage, totalPage, setCurrentPage}) => {

    // test odd num
    viewPagesOddNumber = viewPagesOddNumber % 2
        ? viewPagesOddNumber
        : viewPagesOddNumber + 1;

    // pageJumpPositive
    pageJumpPositive = pageJumpPositive < 0
        ? pageJumpPositive * -1
        : pageJumpPositive === 0
            ? 1
            : pageJumpPositive;


    const setCurrentPageHandler = (newCurrentPage: number) => {
        newCurrentPage !== currentPage && setCurrentPage(newCurrentPage);
    };

    const setCurrentPageJumpHandler = (type: JumpType, vector: VectorType) => {
        let jump = type === "bigJump" ? pageJumpPositive : 1;

        let newCurrentPage = currentPage + (vector === 'down' ? -jump : jump);
        let newCurrentPageToPush = (newCurrentPage < 1) ? 1 : (newCurrentPage > totalPage) ? totalPage : newCurrentPage;
        newCurrentPageToPush !== currentPage && setCurrentPage(newCurrentPageToPush);
    };

    const setFirstCurrentPageHandler = () => {
        currentPage !== 1 && setCurrentPage(1);
    };

    const setLastCurrentPageHandler = () => {
        currentPage !== totalPage && setCurrentPage(totalPage);
    };

    // creating pagesArray
    let leftRightLength = (viewPagesOddNumber + 1) / 2;
    let pagesToRender = [...new Array(viewPagesOddNumber)]
        .map((page, index) => index + 1 + (currentPage <= leftRightLength
            ? 0 : currentPage - leftRightLength))
        .filter(page => page <= totalPage)
        .map(page => {
            let className = currentPage === page ? s.currentPage : '';
            return (
                <div key={page} className={className} onClick={() => setCurrentPageHandler(page)}>{page}</div>
            )
        });

    return (
        <div className={s.paginatorWrapper}>
            <div className={s.leftButtons}>
                <PaginatorButton buttonType={PaginatorButtonType.TO_FIRST}
                                 onClick={setFirstCurrentPageHandler}/>
                <PaginatorButton buttonType={PaginatorButtonType.JUMP_DOWN_BIG}
                                 onClick={() => setCurrentPageJumpHandler("bigJump", 'down')}/>
                <PaginatorButton buttonType={PaginatorButtonType.JUMP_DOWN_BY_ONE}
                                 onClick={() => setCurrentPageJumpHandler("byOne", 'down')}/>
            </div>

            <div className={s.pagesWrapper}>{pagesToRender}</div>

            <div className={s.rightButtons}>
                <PaginatorButton buttonType={PaginatorButtonType.JUMP_UP_BY_ONE}
                                 onClick={() => setCurrentPageJumpHandler("byOne", 'up')}/>
                <PaginatorButton buttonType={PaginatorButtonType.JUMP_UP_BIG}
                                 onClick={() => setCurrentPageJumpHandler("bigJump", 'up')}/>
                <PaginatorButton buttonType={PaginatorButtonType.TO_LAST}
                                 onClick={setLastCurrentPageHandler}/>
            </div>
        </div>
    );
};

export default SuperPaginator;