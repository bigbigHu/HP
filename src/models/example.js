export default {
    namespace: 'todo',
    state: {},
    reducers: {
        init (state, { payload }) {
        // 保存数据到 state
        
            
            return {...state, ...payload};
        },
        adlist (state, { payload }) {
            // console.log(payload);
            const { tableData } = state;
            tableData.push(payload.payload)
            console.log(state)
            return {...state};
        }
    },
    effects: {
        *add (action, { put, call }) {
            console.log(3333333333333333)
            yield put({
                type: 'adlist',
                payload: action
            });
            yield action.callback('请求成功了');
            // setTimeout(() => {
                
            // }, 1000)
        },
        *save({ payload: todo }, { put, call }) {
        // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
        // yield call(saveTodoToServer, todo);
        // yield put({ type: 'add', payload: todo });
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
}