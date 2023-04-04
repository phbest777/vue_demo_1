import request from '@/utils/request'
/*export function getList(data) {
  return request({
    url: '/table/getList',
    method: 'post',
    data,
  })
}*/
export function getList() {
  return request({
    url: '/emps/getlist',
    method: 'get',
  })
}

export function getEmpAll() {
  return request({
    url: '/emps/getlist',
    method: 'get',
  })
}

export function getEmpAllPage(pageNo, pageSize) {
  return request({
    url:
      '/emps/getlist_page/' +
      pageNo +
      '?pageNum=' +
      pageNo +
      '&pageSize=' +
      pageSize,
    method: 'get',
  })
}

export function doEdit(data) {
  return request({
    url: '/table/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/table/doDelete',
    method: 'post',
    data,
  })
}
