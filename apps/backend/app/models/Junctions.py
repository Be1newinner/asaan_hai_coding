from sqlalchemy import Table, Column, ForeignKey

from app.db.base import BaseModel

# Project N:N Media (gallery, no payload)
project_media_relations = Table(
    "project_media_relations",
    BaseModel.metadata,
    Column(
        "project_id", ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True
    ),
    Column("media_id", ForeignKey("media.id", ondelete="CASCADE"), primary_key=True),
)

# Project N:N Tag (no payload)
project_tag_relations = Table(
    "project_tag_relations",
    BaseModel.metadata,
    Column(
        "project_id", ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True
    ),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)
