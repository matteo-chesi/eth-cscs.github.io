# Data Backup

All data present in the filesystems `/users`, `/project` and `/store` are under backup. 

## Retention policies for data backup

 * each file in the filesystem has copy in the backup system
 * when a file is modified, the previous version (extra copy) is kept along with the newly modified one (primary copy)
 * when a file is deleted, the extra copy is deleted immediately from the backup system. The primary copy is kept for 90 days: after 90 days from the deletion on the filesystem, also the primary copy is deleted from the backup system
