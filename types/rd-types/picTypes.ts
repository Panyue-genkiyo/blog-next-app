export interface pic{
    file: null | File;
    url: string | null;
    default?: boolean;
}


export interface picState{
   profilePic: pic,
   thumbnail: pic,
   profileBlogThumbnail: pic,
}

