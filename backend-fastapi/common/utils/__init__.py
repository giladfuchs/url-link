from common.utils.errors import ErrorService
from common.utils.helper import Helper
from common.utils.log import logger


class BaseUtils(ErrorService, Helper):
    logger = logger
