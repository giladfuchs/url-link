from typing import List

from fastapi import APIRouter, Depends

from app.service.auth import Auth
from common.db_model.models import LinkModel
from common.enums import DBOperator
from common.serializers import DBQuery, FilterQuery, Pagination
from common.serializers.payload import FullLinkPayload, LinkPayload, SingleLinkResponse

router = APIRouter(prefix=f"/{LinkModel.model_type}", tags=[LinkModel.model_type])


@router.get("/{alias}", response_model=SingleLinkResponse)
async def view_single_report(
    alias: str, filter_query: FilterQuery = Auth.user_filtered_query()
):
    filter_query.query.append(DBQuery(key="alias", opt=DBOperator.eq, value=alias))
    return await LinkModel.view_single(filter_query=filter_query)


@router.post("", response_model=List[FullLinkPayload])
async def fetch_rows(
    pagination: Pagination = Depends(),
    filter_query: FilterQuery = Auth.user_filtered_query(),
):
    rows = await LinkModel.fetch_rows_with_totals(
        filter_query=filter_query,
        limit=pagination.limit,
        offset=pagination.offset,
    )
    return rows


@router.delete("")
async def delete_rows(filter_query: FilterQuery = Auth.user_filtered_query()):
    await LinkModel.delete_rows(filter_query=filter_query)
    return True


@router.post("/{add_or_id}", response_model=LinkPayload)
async def add_or_update(
    add_or_id: str,
    body: LinkModel.payload,
    user_auth=Depends(Auth.jwt_required),
):
    return await LinkModel.add_or_find_update_single(
        add_or_id=add_or_id, body=body, user_auth=user_auth
    )
