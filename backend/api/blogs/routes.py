"""
Blog API Routes
/api/blogs/routes.py
"""

from flask import current_app, request
from flask_restx import Resource

from app.restx.ns import blogs_ns
from api.core.middleware.schema import S

from .controllers import (
    create_blog,
    get_blog_by_slug,
    get_blog_by_id,
    get_published_blogs,
    get_all_blogs,
    update_blog,
    delete_blog,
    search_blogs_controller,
    get_blogs_by_tag,
    publish_blog,
    unpublish_blog,
)
from .schemas import (
    BlogCreateRequest,
    BlogUpdateRequest,
    BlogCreateResponse,
    BlogResponse,
    BlogListResponse,
    BlogSearchRequest,
)
from ._docs import (
    CREATE_BLOG_DOC,
    LIST_BLOGS_DOC,
    GET_BLOG_BY_SLUG_DOC,
    GET_BLOG_BY_ID_DOC,
    UPDATE_BLOG_DOC,
    DELETE_BLOG_DOC,
    SEARCH_BLOGS_DOC,
    GET_BLOGS_BY_TAG_DOC,
    PUBLISH_BLOG_DOC,
    UNPUBLISH_BLOG_DOC,
    LIST_ALL_BLOGS_DOC,
)
from config import Config


@blogs_ns.route('')
class BlogListResource(Resource):
    """
    Routes for Blog List and Creation
    """
    @blogs_ns.doc(**LIST_BLOGS_DOC)
    @current_app.limiter.limit(Config.BLOG_RATE_LIMIT)
    @S(res = BlogListResponse)
    def get(self):
        """
        Get published blog posts (public)
        """
        limit = int(request.args.get('limit', Config.BLOG_DEFAULT_LIST_LIMIT))
        offset = int(request.args.get('offset', 0))
        return get_published_blogs(limit = limit, offset = offset)

    @blogs_ns.doc(**CREATE_BLOG_DOC)
    @current_app.limiter.limit(Config.BLOG_WRITE_RATE_LIMIT)
    @S(req = BlogCreateRequest, res = BlogCreateResponse)
    def post(self):
        """
        Create a new blog post (admin)
        """
        return create_blog(), 201


@blogs_ns.route('/all')
class BlogAllResource(Resource):
    """
    Admin route to get all blogs including drafts
    """
    @blogs_ns.doc(**LIST_ALL_BLOGS_DOC)
    @current_app.limiter.limit(Config.BLOG_RATE_LIMIT)
    @S(res = BlogListResponse)
    def get(self):
        """
        Get all blog posts including drafts (admin)
        """
        limit = int(request.args.get('limit', Config.BLOG_DEFAULT_LIST_LIMIT))
        offset = int(request.args.get('offset', 0))
        return get_all_blogs(limit = limit, offset = offset)


@blogs_ns.route('/slug/<string:slug>')
class BlogBySlugResource(Resource):
    """
    Routes for individual blog by slug (public)
    """
    @blogs_ns.doc(**GET_BLOG_BY_SLUG_DOC)
    @current_app.limiter.limit(Config.BLOG_RATE_LIMIT)
    @S(res = BlogResponse)
    def get(self, slug: str):
        """
        Get a published blog post by slug
        """
        return get_blog_by_slug(slug)


@blogs_ns.route('/<string:blog_id>')
class BlogResource(Resource):
    """
    Routes for individual blog operations (admin)
    """
    @blogs_ns.doc(**GET_BLOG_BY_ID_DOC)
    @current_app.limiter.limit(Config.BLOG_RATE_LIMIT)
    @S(res = BlogResponse)
    def get(self, blog_id: str):
        """
        Get a blog post by ID (admin)
        """
        return get_blog_by_id(blog_id)

    @blogs_ns.doc(**UPDATE_BLOG_DOC)
    @current_app.limiter.limit(Config.BLOG_WRITE_RATE_LIMIT)
    @S(req = BlogUpdateRequest, res = BlogCreateResponse)
    def put(self, blog_id: str):
        """
        Update a blog post (admin)
        """
        return update_blog(blog_id)

    @blogs_ns.doc(**DELETE_BLOG_DOC)
    @current_app.limiter.limit(Config.BLOG_WRITE_RATE_LIMIT)
    def delete(self, blog_id: str):
        """
        Delete a blog post (admin)
        """
        return delete_blog(blog_id)


@blogs_ns.route('/<string:blog_id>/publish')
class BlogPublishResource(Resource):
    """
    Route to publish a blog post
    """
    @blogs_ns.doc(**PUBLISH_BLOG_DOC)
    @current_app.limiter.limit(Config.BLOG_WRITE_RATE_LIMIT)
    @S(res = BlogCreateResponse)
    def post(self, blog_id: str):
        """
        Publish a draft blog post (admin)
        """
        return publish_blog(blog_id)


@blogs_ns.route('/<string:blog_id>/unpublish')
class BlogUnpublishResource(Resource):
    """
    Route to unpublish a blog post
    """
    @blogs_ns.doc(**UNPUBLISH_BLOG_DOC)
    @current_app.limiter.limit(Config.BLOG_WRITE_RATE_LIMIT)
    @S(res = BlogCreateResponse)
    def post(self, blog_id: str):
        """
        Unpublish a blog post to draft (admin)
        """
        return unpublish_blog(blog_id)


@blogs_ns.route('/search')
class BlogSearchResource(Resource):
    """
    Route for blog search
    """
    @blogs_ns.doc(**SEARCH_BLOGS_DOC)
    @current_app.limiter.limit(Config.BLOG_RATE_LIMIT)
    @S(req = BlogSearchRequest, res = BlogListResponse)
    def post(self):
        """
        Search published blogs
        """
        return search_blogs_controller()


@blogs_ns.route('/tag/<string:tag>')
class BlogsByTagResource(Resource):
    """
    Route to get blogs by tag
    """
    @blogs_ns.doc(**GET_BLOGS_BY_TAG_DOC)
    @current_app.limiter.limit(Config.BLOG_RATE_LIMIT)
    @S(res = BlogListResponse)
    def get(self, tag: str):
        """
        Get published blogs filtered by tag
        """
        limit = int(request.args.get('limit', Config.BLOG_DEFAULT_LIST_LIMIT))
        return get_blogs_by_tag(tag = tag, limit = limit)
