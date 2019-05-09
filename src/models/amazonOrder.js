import amazonOrderService from '@/common/service/OMS/amazonOrderService';
export default {
    namespace: 'amazonOrder',
    state: {
    },
    reducers: {
        init (state, { payload }) {
            state.tableData = payload;
        // 保存数据到 state
            return {...state};
        },
        adlist (state, { payload }) {
            const { tableData } = state;
            tableData.push(payload);
            return {...state};
        },
    },
    effects: {
        *query (action, { call, put }) {
            const result = yield call(amazonOrderService.queryList, action.payload);
            yield put({
                type: 'init',
                payload: result.data.info.content,
            });
        },
        *add (action, { call, put }) {
            const result = yield call(amazonOrderService.add, action.payload);
            console.log(result);
            yield put({
                type: 'init',
                payload: result.data.info.content,
            });
            yield action.callback('新增成功了');
        },
        *remove (action, { call, put }){
            const result = yield call(amazonOrderService.remove, action.payload);
            yield put({
                type: 'init',
                payload: result.data.info.content,
            });
        },
        *edit (action, { call, put }) {
            const result = yield call(amazonOrderService.edit, action.payload);
            yield put({
                type: 'init',
                payload: result.data.info.content,
            });
            yield action.callback('编辑成功了');
        },
    },
    // subscriptions: {
    //     setup({ history, dispatch }) {
    //     // 监听 history 变化，当进入 `/` 时触发 `load` action
    //     return history.listen(({ pathname }) => {
    //         if (pathname === '/') {
    //         dispatch({ type: 'load' });
    //         }
    //     });
    //     },
    // },
};