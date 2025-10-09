from fastapi import APIRouter, Depends
from sqlalchemy.orm  import Session
from starlette import status

from database import get_db
from domain.question import question_schema, question_crud

router = APIRouter(
    prefix="/api/question"
)

@router.get("/list", response_model=question_schema.QuestionList)
def question_list(db: Session=Depends(get_db), page: int = 0, size: int = 10):
    total, items = question_crud.get_question_list(db, skip=page*size, limit=size)
    
    return {
        'total': total,
        'items': items
    }

@router.get("/detail/{question_id}", response_model=question_schema.Question)
def question_detail(question_id:int, db:Session=Depends(get_db)):
    _question = question_crud.get_question(db, question_id)
    return _question

@router.post('/create', response_model=question_schema.Question, status_code=status.HTTP_201_CREATED)
def question_create(question_create:question_schema.QuestionCreate, db: Session=Depends(get_db)):
    return question_crud.create_question(db=db, question_create=question_create)