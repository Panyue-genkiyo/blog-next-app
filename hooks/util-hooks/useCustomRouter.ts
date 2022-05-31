import { useRouter } from "next/router";
import {useCallback} from "react";

const useCustomRouter = () => {
    const router = useRouter();

    const pushQuery = useCallback((query: any) => {
        router.push({
            pathname: `${router.pathname}`,
            query: {slug: query.slug, page: query.page, sort: query.sort}
        });
    }, []);

    return { pushQuery }
};

export default useCustomRouter;
